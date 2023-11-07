import { User } from "../config/db";

(async () => {
  await User.create({
    data: {
      email: "skylinelimo0@gmail.com",
      lastName: "Gellaw",
      firstName: "Lidiya",
      password: "$2a$10$EZq8FjlPlFQJtctyPFfOfuYBRf1SAb57C/Kj1AzKUrgFfpSpzAQSG",
      // password: "123456",
    },
  });
})();
