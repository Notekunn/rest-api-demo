exports.success = (res, status) => (entity) => {
    if (entity) {
        res.status(status || 200).json(Array.isArray(entity) ? { data: entity } : entity);
    }
    return null;
}

exports.notFound = (res) => (message) => {
    // if (entity) {
    //     return entity;
    // }
    res.status(404).send({ error: { message: message.trim(".") + "." } });
    return null;
}

exports.error = (res, status) => (error) => {
    if (error) {
        res.status(status || 400).json({ error: { message: error.message, stack: error.stack } });
    }
    return null;
}

exports.authorOrAdmin = (res, user, userField) => (entity) => {
    if (entity) {
        const isAdmin = user.role === 'admin';
        const isAuthor = entity[userField] && entity[userField].equals(user.id);
        if (isAuthor || isAdmin) {
            return entity;
        }
        res.status(401).end();
    }
    return null;
}