import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "kibeti2000@gmail.com";

  const updatedUser = await prisma.user.update({
    where: { emailAdress: email },
    data: { role: "admin" },
  });

  console.log("User is now admin:", updatedUser);
}

main()
  .catch((err) => {
    console.error("Error updating user role:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
