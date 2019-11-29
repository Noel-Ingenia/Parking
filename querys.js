const sql = require('mssql');
const config = require('./config');

QueryFunction = (paramInt, paramString, query) => {
    return new Promise(function(resolve, reject) {
        sql.connect(config, err => {
            new sql.Request()
            .input('paramInt', sql.Int, paramInt) // PARAMETRO 1
            .query(query, (err, result) => {
                console.dir(result.recordset);
                sql.close();
                resolve(result.recordset);
            });
        });
    });
};

module.exports = {
    
    login: 'SELECT * FROM Employee WHERE UserName = @UserName AND UserPassword = @UserPassword',
    
    getRol: 'SELECT R.RolType FROM Rol R WHERE R.Id = ( SELECT RA.Rol FROM RolAssignation RA WHERE RA.IdEmployee = @paramInt )',

    homeGetUserRequestDays: 'SELECT RD.Id FROM Request R, RequestDays RD WHERE R.IdEmployee = @paramInt AND R.Id = RD.IdRequest',
    
    homeGetUserAssignations: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Request RQ, RequestDays RQD WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND R.IdAssignation = A.Id ' +
    'AND RD.IdReleased = R.Id AND RQD.IdReleasedDay = RD.Id AND RQ.Id = RQD.IdRequest AND RQ.IdEmployee = @paramInt',
    
    homeGetUserReleasedDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Occupant O WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @paramInt AND ' +
    'A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    homeGetGroupReleasedDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Occupant O WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdGroup = @paramInt AND ' +
    'A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    QueryFunction: QueryFunction,
};