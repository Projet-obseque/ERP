import { app } from './config.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getTenantId } from './tenant_context.js';

const storage = app ? getStorage(app) : getStorage();

export async function uploadDocumentToStorage(file, folder = "agency_assets") {
    if (!file) throw new Error("Aucun fichier à envoyer.");
    const tenantId = getTenantId();
    const safeName = String(file.name || "document").replace(/[^\w.\-]/g, "_");
    const path = `${folder}/${tenantId}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" });
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, path };
}
