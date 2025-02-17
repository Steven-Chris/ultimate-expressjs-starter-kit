import { strictThrottler } from "@/src/common/throttlers/strict.throttler";
import { Router } from "express";
import { customerAuthController } from "./customer-auth.controller";

export const customerAuthRouter = Router();

/**
 * @swagger
 * /api/customer/auth/signin:
 *  post:
 *    tags: [Auth/Customer]
 *    summary: Signin to the customer panel
 *    description: Signin to the customer panel.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: OK
 */
customerAuthRouter.post(
  "/customer/auth/signin",
  strictThrottler,
  customerAuthController.signin
);
