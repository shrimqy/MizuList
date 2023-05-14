import { Auth } from './lib/server/lucia';
import { PrismaClient } from "@lucia-auth/adapter-prisma/prisma";

// declare global {
//     namespace App {
//         interface Locals {
//             validate: import("@lucia-auth/sveltekit").Validate
//             validateUser: import("@lucia-auth/sveltekit").ValidateUser
//             setSession: import("@lucia-auth/sveltekit").SetSession
//         }
//     }
//     var __prisma: PrismaClient

//     declare namespace Lucia {
//         type Auth = import("$lib/server/lucia").Auth
//         type UserAttributes = {
//             username: string
//             name: string
//         }
//     }
// }

// export {}