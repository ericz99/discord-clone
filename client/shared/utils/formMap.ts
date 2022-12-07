import { PERMISSION_LIST } from "../types";

const formMap = {
  channelForm: {
    inputs: [
      {
        type: "text",
        name: "name",
        placeholder: "Your Channel Name",
        required: true,
        label: "Channel Name",
      },
    ],
  },
  roleForm: {
    inputs: [
      {
        type: "text",
        name: "roleName",
        placeholder: "Your Role Name",
        required: true,
        label: "Role Name",
      },
    ],
    options: [
      {
        value: PERMISSION_LIST.ADMIN_CRUD,
        label: PERMISSION_LIST.ADMIN_CRUD,
      },
      {
        value: PERMISSION_LIST.CHANNEL_CREATION,
        label: PERMISSION_LIST.CHANNEL_CREATION,
      },
      {
        value: PERMISSION_LIST.CHANNEL_DELETION,
        label: PERMISSION_LIST.CHANNEL_DELETION,
      },
      {
        value: PERMISSION_LIST.CHANNEL_DELETION,
        label: PERMISSION_LIST.CHANNEL_DELETION,
      },
      {
        value: PERMISSION_LIST.CHANNEL_UPDATION,
        label: PERMISSION_LIST.CHANNEL_UPDATION,
      },
      {
        value: PERMISSION_LIST.ROLE_CREATION,
        label: PERMISSION_LIST.ROLE_CREATION,
      },
      {
        value: PERMISSION_LIST.ROLE_DELETION,
        label: PERMISSION_LIST.ROLE_DELETION,
      },
      {
        value: PERMISSION_LIST.ROLE_UPDATION,
        label: PERMISSION_LIST.ROLE_UPDATION,
      },
      {
        value: PERMISSION_LIST.ADD_PERMISSION,
        label: PERMISSION_LIST.ADD_PERMISSION,
      },
      {
        value: PERMISSION_LIST.REMOVE_PERMISSION,
        label: PERMISSION_LIST.REMOVE_PERMISSION,
      },
      {
        value: PERMISSION_LIST.ADD_MEMBER_TO_SERVER,
        label: PERMISSION_LIST.ADD_MEMBER_TO_SERVER,
      },
      {
        value: PERMISSION_LIST.REMOVE_MEMBER_FROM_SERVER,
        label: PERMISSION_LIST.REMOVE_MEMBER_FROM_SERVER,
      },
      {
        value: PERMISSION_LIST.DELETE_SERVER,
        label: PERMISSION_LIST.DELETE_SERVER,
      },

      {
        value: PERMISSION_LIST.ADD_ROLE_TO_USER,
        label: PERMISSION_LIST.ADD_ROLE_TO_USER,
      },
      {
        value: PERMISSION_LIST.REMOVE_ROLE_FROM_USER,
        label: PERMISSION_LIST.REMOVE_ROLE_FROM_USER,
      },
    ],
  },
};

export default formMap;
