import { auth, db } from './config.js';
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const DEFAULT_TENANT_ID = "default_agency";

export function getTenantId() {
    // Application mono-agence: un seul profil partagé entre les utilisateurs internes.
    return DEFAULT_TENANT_ID;
}

export async function refreshCompanyProfile() {
    const tenantId = getTenantId();
    const profileRef = doc(db, "company_profiles", tenantId);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() || {}) };
}

export async function saveCompanyProfile(profile) {
    const tenantId = getTenantId();
    const profileRef = doc(db, "company_profiles", tenantId);
    const payload = {
        ...(profile || {}),
        tenant_id: tenantId,
        updated_at: serverTimestamp()
    };
    await setDoc(profileRef, payload, { merge: true });
    return { id: tenantId, ...payload };
}
