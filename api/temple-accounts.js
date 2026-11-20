const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

const master = 'rJ4xdMH3a2Yobut7Wsm5IpWvg7f2';
const project = 'iskcon-master-hub';
module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).end();
    const token = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
    if (!token) return res.status(401).end();
    try {
        if (!getApps().length) {
            const service = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
            if (service.project_id !== project) return res.status(503).json({error:'Configure FIREBASE_SERVICE_ACCOUNT_JSON for the temple Firebase project on Vercel.'});
            initializeApp({credential:cert(service), databaseURL:'https://iskcon-master-hub-default-rtdb.asia-southeast1.firebasedatabase.app'});
        }
        const auth = getAuth();
        const who = await auth.verifyIdToken(token[1], true);
        if (who.uid !== master) return res.status(403).end();
        const {action, uid, email, password, cursor, hash, key} = req.body || {};
        const db = getDatabase();
        if (action === 'list') {
            const page = await auth.listUsers(100, cursor || undefined);
            const [bindings, registry] = await Promise.all(['device_bindings','device_registry'].map(path => db.ref(path).once('value')));
            const pairs = new Map();
            function add(key, hash) {
                if (typeof hash === 'string' && typeof key === 'string') pairs.set(JSON.stringify([key,hash]), {key,hash});
            }
            bindings.forEach(s => { add(s.key,s.child('bound_device_hash').val()); });
            registry.forEach(s => { add(s.child('registered_email').val(),s.key); });
            return res.json({users:page.users.filter(u => u.email && u.uid !== master).map(u => ({uid:u.uid,email:u.email})),cursor:page.pageToken, links:[...pairs.values()]});
        }
        if (action === 'release') {
            if (![hash,key].every(v => typeof v === 'string' && v.length && !/[.#$\[\]\/\x00-\x1f\x7f]/.test(v))) return res.status(400).end();
            const release = async (path, field, expected) => {
                const ref = db.ref(path);
                await ref.once('value');
                await ref.transaction(row => row && row[field] === expected ? null : undefined);
            };
            await release('device_bindings/'+key,'bound_device_hash',hash);
            await release('device_registry/'+hash,'registered_email',key);
            return res.json({ok:true});
        }
        if (!['password','delete'].includes(action) || !uid || uid === master) return res.status(400).end();
        const user = await auth.getUser(uid);
        if (!email || user.email !== email) return res.status(409).json({error:'Account changed. Refresh the list.'});
        if (action === 'delete') {
            const accountKey = email.replace(/[.#$[\]]/g,'_');
            const [bound, registered] = await Promise.all([
                db.ref('device_bindings/'+accountKey).once('value'),
                db.ref('device_registry').orderByChild('registered_email').equalTo(accountKey).limitToFirst(1).once('value')
            ]);
            if (bound.exists() || registered.exists()) return res.status(409).json({error:'Release the listed device link first.'});
            await auth.deleteUser(uid);
        } else {
            if (typeof password !== 'string' || password.length < 6) return res.status(400).json({error:'Enter at least 6 characters.'});
            await auth.updateUser(uid,{password});
        }
        return res.json({ok:true});
    } catch (e) {
        const code = String(e.code || 'server/configuration-error');
        return res.status(400).json({error:code});
    }
};
