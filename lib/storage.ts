import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    throw new Error(
        "Missing R2 env vars (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, NEXT_PUBLIC_R2_PUBLIC_URL)"
    );
}

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
});

const PUBLIC_BASE = publicUrl.replace(/\/$/, "");

const EXT_BY_MIME: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
};

function slugify(s: string): string {
    return (
        s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 60) || "untitled"
    );
}

export async function uploadImage(
    file: File,
    prefix: "covers" | "stacks",
    nameHint?: string
): Promise<string> {
    const mime = file.type || "application/octet-stream";
    const ext = EXT_BY_MIME[mime.split(";")[0].trim()] ?? "bin";
    const stem = nameHint ? slugify(nameHint) : "img";
    const key = `${prefix}/${stem}-${Date.now().toString(36)}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    await r2.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buf,
            ContentType: mime,
        })
    );

    return `${PUBLIC_BASE}/${key}`;
}

export async function deleteImage(url: string | null | undefined): Promise<void> {
    if (!url) return;
    if (!url.startsWith(PUBLIC_BASE + "/")) return;
    const key = url.slice(PUBLIC_BASE.length + 1);
    if (!key) return;
    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
