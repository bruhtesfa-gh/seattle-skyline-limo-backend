import { User } from "../config/db";

(async () => {
  await User.create({
    data: {
      "firstName": "Lidiya",
      "lastName": "Gelaw",
      "img": "http://res.cloudinary.com/etmedia/image/upload/v1690966488/ldvcyenaktohjfvxosbp.jpg",
      "email": "skylinelimo0@gmail.com",
      "password": "$2b$10$JTNDNt8rQOK4XBEl48U/dOe4tUHeZcqCWakj5135J1P.84Ttb2u0y",
      // password: "123456",
    },
  });
})();
