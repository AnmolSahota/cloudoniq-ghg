export const backendFormConfig = {
  register: {
    fields: ["name", "email", "userId", "password"]
  },
  login: {
    fields: ["userId", "loginPassword"]
  },
  user: {
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "department",
      "designation",
      "branch",
      "address",
      "city",
      "state",
      "pincode"
    ]
  },
  organization: {
    fields: ["organizationCode", "organizationName", "address"]
  }
};
