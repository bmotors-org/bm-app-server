import {authRoutes} from "./auth/routes"
import {profileRoutes} from "./profile/routes"

export const router = {
  authRoutes,
  profileRoutes
}

const baseRoutePath = "/api"

export {baseRoutePath as baseFragment}