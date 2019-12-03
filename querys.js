const sql = require('mssql');
const config = require('./config');

QueryFunction = (paramInt, paramString, query) => {
    return new Promise(function(resolve, reject) {
        sql.connect(config, err => {
            new sql.Request()
            .input('paramInt', sql.Int, paramInt) // PARAMETRO 1
            .query(query, (err, result) => {
                //console.dir(result.recordset);
                sql.close();
                resolve(result.recordset);
            });
        });
    });
};


module.exports = {
    
    login: 'SELECT * FROM Employee WHERE UserName = @UserName AND UserPassword = @UserPassword',
    
    getRol: 'SELECT R.RolType FROM Rol R WHERE R.Id = ( SELECT RA.Rol FROM RolAssignation RA WHERE RA.IdEmployee = @paramInt )',

    homeGetGroupReleasedDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Occupant O WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdGroup = @paramInt AND ' +
    'A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    homeGetUserAssignations: 'SELECT A.Id FROM Assignation A, Occupant O WHERE O.IdUser = @paramInt AND A.IdOccupant = O.Id',

    homeGetUserRequestDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Request RQ, RequestDays RQD WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND R.IdAssignation = A.Id ' +
    'AND RD.IdReleased = R.Id AND RQD.IdReleasedDay = RD.Id AND RQ.Id = RQD.IdRequest AND RQ.IdEmployee = @paramInt',
    
    homeGetUserReleasedDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay FROM Place Pl, Parking P, ReleasedDays RD, ' +
    'Released R, Assignation A, Occupant O WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @paramInt AND ' +
    'A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    releaseInsert: 'INSERT INTO Released (IdAssignation) OUTPUT INSERTED.id SELECT A.Id FROM Assignation A, Occupant O WHERE ' +
    'A.IdOccupant = O.Id AND O.IdUser = @IdUser',

    releaseDaysInsert: 'INSERT INTO ReleasedDays (IdReleased, SelectedDay) VALUES ',

    requestInsert: 'INSERT INTO Request (IdEmployee) OUTPUT INSERTED.id VALUES (@IdUser)',

    requestDaysInsert: 'INSERT INTO RequestDays (IdRequest, SelectedDay) VALUES ',



    QueryFunction: QueryFunction,
};