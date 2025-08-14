import { verifyFree } from "@/lib/freeEmailVerification";

(async () => {
  console.log(await verifyFree("real@gmail.com")); // should return deliverable: true
  console.log(await verifyFree("test@tempmail.com")); // disposable
  console.log(await verifyFree("bademail.com")); // invalid format
  console.log(await verifyFree("name@madeupdomainxyz123.com")); // no MX
})();