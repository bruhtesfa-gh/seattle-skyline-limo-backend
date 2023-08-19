import { Router } from "express";
import {
  deleteService,
  getService,
  getServices,
  postService,
  updateService,
} from "../controller/service.controller";
import { catchAsync } from "../util/error";
import { isAuth } from "../util/auth";
const router = Router();
router.route("/").post(catchAsync(isAuth), postService).get(getServices);
router
  .route("/:id")
  .delete(catchAsync(isAuth), deleteService)
  .patch(catchAsync(isAuth), updateService)
  .get(getService);
export default router;
