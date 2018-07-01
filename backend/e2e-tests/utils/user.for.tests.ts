import * as Chance from "chance"
import * as _ from "lodash"
import Users from "../../models/users/users"
import * as UsersAuth from "../../models/user-auth/user-auth"
import config from "../../app-logic/config"
import SQL from "../../models/mysql-pool/mysql-pool"

var users = new Users(new SQL(config))
var chance = Chance()

import { ExistingUserInterface } from "../../models/users/types"
import NotFound from "@/utils/not-found.ts"

export async function create({
  users: Users,
}): Promise<{ user: ExistingUserInterface; token: string }> {
  var user_id = await users.createUser({
    disabled: null,
    email: "email-is-not-missing@haamifsfSFsadf.com",
    fname: "moshe",
    lname: "Marilush",
    plainPassword: "danny-gembom",
  })
  const token = UsersAuth.generateJWT(user_id, config.auth.jwt.secret)
  var user = await users.tryGetUserById(user_id)
  if (user instanceof NotFound) {
    throw new Error("cannot create user for tests")
  }
  return { user, token }
}