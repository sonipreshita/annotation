/**
 * checkPermission
 *
 */

module.exports = function (req, res, next) {

        var adminId = req.session.user.id;
        var rollId = req.session.user.roleId;

        RolePermissions.find({ role_id: rollId }).exec(function (err, rolepermissions) {

            if (rolepermissions.length > 0) {
                var foundPermissionKey = rolepermissions[0].permission_Key;
                var savePermissionKey = [];
                foundPermissionKey.forEach(function (item) {
                    savePermissionKey.push(item.key);
                });
                req.session.userPermissions = savePermissionKey;
                return next();
            } else {
                return next();
            }
        });
};
