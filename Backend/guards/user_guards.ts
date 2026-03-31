import Authenticator from "../Services/auth_services.ts";

export const hasAdminAccessToSchool = (req, res, next) => {
    let requestedSchoolId = getSchoolIdFromRequest(req, res);
    if (!requestedSchoolId) {
        return;
    }

    let token = getAuthTokenFromRequest(req, res);
    if (!token) {
        return;
    }

    if (!validateSchoolAccess(token, requestedSchoolId, true)) {
        return res.status(403).send("School admin access is required for this action.");
    }

    next();
};

export const hasSudoAccess = (req, res, next) => {
    let token = getAuthTokenFromRequest(req, res);
    if (!token) {
        return res.status(401).send("Unauthorized.");
    }
    if (token.isSudo) {
        next();
    } else {
        return res.status(403).send("Sudo access is required for this action.");
    }
}

export const hasAccessToSchool = (req, res, next) => {
    let requestedSchoolId = getSchoolIdFromRequest(req, res);
    if (!requestedSchoolId) {
        return;
    }

    let token = getAuthTokenFromRequest(req, res);
    if (!token) {
        return res.status(401).send("Unauthorized.");
    }

    if (token.isSudo) {
        return next();
    }

    if (!validateSchoolAccess(token, requestedSchoolId, false)) {
        return res.status(403).send("School member access is required for this action.");
    }

    next();
}


const getSchoolIdFromRequest = (req, res) => {
    let {schoolId: requestedSchoolId} = req.query;
    requestedSchoolId = parseInt(requestedSchoolId);
    if (!requestedSchoolId) {
        res.status(400).send("School ID is required for this action.");
        return null;
    }
    return requestedSchoolId;
};

const getAuthTokenFromRequest = (req, res) => {
    let cookie = req.cookies["AUTH_TOKEN"];
    if (!cookie) {
        res.status(401).send("Unauthorized");
        return null;
    }

    let token = Authenticator.decodeJWT(cookie);
    if (!token) {
        res.status(401).send("Unauthorized");
        return null;
    }

    return token;
};

const validateSchoolAccess = (token, schoolId, requireAdmin = false) => {
    if (requireAdmin) {
        return token.accessList?.filter(x => x.SchoolId == schoolId && x.IsAdmin).length > 0;
    }
    return token.accessList?.filter(x => x.SchoolId == schoolId).length > 0;
};