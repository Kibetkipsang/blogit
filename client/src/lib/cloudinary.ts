export async function uploadToCloudinary(file: File) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "unsigned_blogit_upload");
  const cloudName = "diecrcqhy";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: data,
    },
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  return await res.json();
}
