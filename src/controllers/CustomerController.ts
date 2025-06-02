export default {
  list: () => {
    const customers = [
      {
        id: 1,
        name: "Mint1",
        email: "email1@gmail.com",
      },
      {
        id: 2,
        name: "Mint2",
        email: "email2@gmail.com",
      },
      {
        id: 3,
        name: "Mint3",
        email: "email3@gmail.com",
      },
    ];
    return customers;
  },
  create: ({
    body,
  }: {
    body: {
      id: number;
      name: string;
      email: string;
    };
  }) => {
    return body;
  },
  update: ({
    params,
    body,
  }: {
    params: {
      id: number;
    };
    body: {
      name: string;
      email: string;
    };
  }) => {
    return { id: params.id, body: body}
  },
  remove: ({
    params,
  }: {
    params: {
      id: number;
    };
  }) => {
    return { id: params.id}
  },
};
