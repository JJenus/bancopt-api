import { Router } from "express";
import * as sseController from "./sse.controller";
import { validateRequest } from "../../common/middlewares";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

const router = Router();

router.get(
	"/:id",
	validateRequest({ params: ParamsWithId }),
	sseController.subscribe
);