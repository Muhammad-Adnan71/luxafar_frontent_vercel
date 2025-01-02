import { chain } from "middlewares/chain";
import { withCors } from "middlewares/corsMiddleware";
import { withAuthMiddleware } from "middlewares/authMiddleware";
import { withI18nMiddleware } from "middlewares/i18nMiddleware";

export default chain([withCors, withAuthMiddleware]);

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*", "/:path*"],
};
