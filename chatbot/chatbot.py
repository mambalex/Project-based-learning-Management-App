import database as db
import time
import re
import rivescript


class Chatbot():
    current_project_id = None
    current_project_data = None
    current_user = None
    current_group = None

    rs_chatbot = None
    rive_file = None

    def __init__(self, project_id, current_user, rive_file_addr):
        self.current_project_id = project_id
        self.current_user = current_user
        self.rive_file = rive_file_addr
        self.load_project_data()
        self.load_group()
        self.rs_chatbot = rivescript.rivescript.RiveScript(utf8=True)
        self.rs_chatbot.load_file(self.rive_file)
        self.rs_chatbot.sort_replies()

    def load_project_data(self):
        self.current_project_data = db.get_projects(self.current_project_id)[0]
        phases_list = db.get_project_all_phases(self.current_project_id)
        for phase in phases_list:
            tasks_list = db.get_phase_all_tasks(phase['phase_uuid'])
            phase['tasks_list'] = tasks_list
        self.current_project_data['phases_list'] = phases_list

        print(self.current_project_data)

    def load_group(self):
        self.current_group = db.get_self_group(self.current_user, self.current_project_id)
        if len(self.current_group) != 0:
            self.current_group = self.current_group[0]
        else:
            self.current_group = None

    def get_reply(self, msg):
        reply = self.rs_chatbot.reply(self.current_user, msg)
        input_type = re.search(r'\$\$.*\$\$', reply)
        if input_type is None:
            return [reply, 'unknown']
        input_type = re.sub(r'\$\$', '', input_type.group(0))
        reply = re.sub(r'\$\$.*\$\$', '', reply)

        print(input_type)
        if input_type == "search":
            if re.search('phase', reply):
                return self.__get_search_phase_reply(reply, input_type)
            else:
                return self.__get_search_task_reply(reply, input_type)
        else:
            print(input_type)
            return self.__get_reminder_reply(reply, input_type)

    def __get_search_phase_reply(self, reply, input_type):
        phase_index = re.search(r'\|\|.*\|\|', reply)
        print(phase_index)
        if phase_index is None:
            return ["Looks like you didn't tell me phase name or index.", input_type]
        phase_index = re.sub(r'\|\|', '', phase_index.group(0))
        reply = re.sub(r'\|\|.*\|\|', '', reply)
        print(phase_index)
        target = re.search(r'##.*##', reply)
        target = re.sub(r'##', '', target.group(0))
        print(target)

        try:
            phase_index = int(phase_index)
        except ValueError:
            if phase_index.lower() == "one":
                phase_index = 1
            elif phase_index.lower() == "two":
                phase_index = 2
            elif phase_index.lower() == "three":
                phase_index = 3
            elif phase_index.lower() == "four":
                phase_index = 4
            else:
                for phase in self.current_project_data['phases_list']:
                    if re.search(phase_index, phase['phase_name'].lower()):
                        phase_index = phase['phase_index']

        if isinstance(phase_index, int):
            for phase in self.current_project_data['phases_list']:
                if phase['phase_index'] == phase_index:
                    if target == 'deadline':
                        print("search deadline")
                        reply = re.sub(r'##.*##', phase['deadline'], reply)
                        break
                    elif target == "mark_release":
                        print("search mark_release")
                        reply = re.sub(r'##.*##', phase['mark_release'], reply)
                        break
                    elif target == "mark":
                        print("search mark")
                        if self.current_group is None:
                            if self.current_user == self.current_project_data['master']:
                                return ["Lecturer does not have a mark.", input_type]
                            return ["It seems that you have not joined a group yet.", input_type]

                        phase_mark = db.get_self_submit(self.current_group['group_uuid'], phase['phase_uuid'])
                        if len(phase_mark) == 0:
                            return ["It seems that your team has not submitted assignments yet.", input_type]
                        phase_mark = phase_mark[0]["mark"]
                        if phase_mark == "None":
                            return ["The mark of this phase has not been released yet.", input_type]
                        reply = re.sub(r'##.*##', phase_mark, reply)
                        break
                    elif target == "submission":
                        print("search submission")
                        if self.current_user != self.current_project_data['master']:
                            return ["Insufficient permissions to access the summary of submission", input_type]
                        print(phase)
                        all_group_list = db.get_all_group(self.current_project_id)
                        summary = "\nThere are total {} phases in this project.\n".format(len(phase['tasks_list']))
                        for task in phase['tasks_list']:
                            submit_group = db.get_submits(task['task_uuid'])
                            submit_group = [item['group_uuid'] for item in submit_group]
                            nosubmit_group = [item for item in submit_group if item['file_address'] == "None"]
                            summary = summary + "  {}/{} groups have submitted task {}.\n".format(
                                len(submit_group)-len(nosubmit_group), len(all_group_list), task['task_name'])
                        reply = re.sub(r'##.*##', summary, reply)
                        break
            return [reply, input_type]
        else:
            return ['It seems that this phase does not exist.', input_type]

    def __get_search_task_reply(self, reply, input_type):
        find_flag = False
        task_index = re.search(r'\|\|.*\|\|', reply)
        print(task_index)
        if task_index is None:
            return ["Looks like you didn't tell me phase name or index.", input_type]
        task_index = re.sub(r'\|\|', '', task_index.group(0))
        reply = re.sub(r'\|\|.*\|\|', '', reply)
        print(task_index)
        target = re.search(r'##.*##', reply)
        target = re.sub(r'##', '', target.group(0))
        print(target)
        for phase in self.current_project_data['phases_list']:
            for task in phase['tasks_list']:
                if re.search(task_index, task['task_name'].lower()):
                    find_flag = True
                    if target == 'deadline':
                        print("search deadline")
                        reply = re.sub(r'##.*##', task['deadline'], reply)
                        break
                    elif target == "mark_release":
                        print("search mark_release")
                        reply = re.sub(r'##.*##', task['mark_release'], reply)
                        break
                    elif target == "mark":
                        print("search mark")
                        if self.current_group is None:
                            return ["It seems that you have not joined a group yet.", input_type]

                        task_mark = db.get_self_submit(self.current_group['group_uuid'], task['task_uuid'])
                        if len(task_mark) == 0:
                            return ["It seems that your team has not submitted assignments yet.", input_type]
                        task_mark = task_mark[0]["mark"]
                        if task_mark == "None":
                            return ["The marks of this task have not been released yet.", input_type]
                        reply = re.sub(r'##.*##', task_mark, reply)
                        break
                    elif target == "submission":
                        print("search submission")
                        if self.current_user != self.current_project_data['master']:
                            return [
                                "Insufficient permissions to access the summary of submission",
                                input_type]
                        print(phase)
                        all_group_list = db.get_all_group(self.current_project_id)
                        for task in phase['tasks_list']:
                            if re.search(task_index, task['task_name'].lower()):

                                submit_group = db.get_submits(task['task_uuid'])
                                submit_group = [item['group_uuid'] for item in submit_group]
                                nosubmit_group = [item for item in submit_group if item['file_address'] == "None"]

                                summary = "\n{}/{} groups have submitted task {}.\n".format(
                                len(submit_group)-len(nosubmit_group), len(all_group_list), task['task_name'])
                                break
                        reply = re.sub(r'##.*##', summary, reply)
                        break
            if find_flag:
                return [reply, input_type]
        return ['It seems that this task does not exist.', input_type]

    def __get_reminder_reply(self, reply, input_type):
        reply = re.sub(r'\$\$reminder\$\$', '', reply)
        return [reply, input_type]

    def __bot_reply(self, msg):
        return self.rs_chatbot.reply(self.current_user, msg)
