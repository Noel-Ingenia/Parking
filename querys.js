const sql = require('mssql');
const config = require('./config');

QueryFunction = (param1, param2, query) => {
    return new Promise(function(resolve, reject) {
        sql.connect(config, err => {
            new sql.Request()
            .input('param1', param1) // PARAMETRO 1
            .input('param2', param2) // PARAMETRO 1
            .query(query, (err, result) => {
                //console.dir(result);
                sql.close();
                resolve(result.recordset);
            });
        });
    });
};

module.exports = {
    
    // LOGIN SCREEN ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    login: 'SELECT * FROM Employee WHERE UserName = @UserName AND UserPassword = @UserPassword',
    
    getRol: 'SELECT R.RolType FROM Rol R WHERE R.Id = ( SELECT RA.Rol FROM RolAssignation RA WHERE RA.IdEmployee = @param1 )',

    // HOME SCREEN /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET
    homeGetGroupPlaces: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName ' +
    'FROM Place Pl, Parking P, Assignation A, Occupant O ' +
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdGroup = @param1 AND A.IdOccupant = O.Id',

    homeGetUserPlace: 'SELECT P.ParkingName, P.MapUrl, Pl.PlaceName ' +
    'FROM Place Pl, Parking P, Assignation A, Occupant O ' +
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @param1 AND A.IdOccupant = O.Id',

    homeGetUserRequestDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay ' +
    'FROM Place Pl, Parking P, ReleasedDays RD, Released R, Assignation A, Request RQ, RequestDays RQD ' +
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id ' +
    'AND RQD.IdReleasedDay = RD.Id AND RQ.Id = RQD.IdRequest AND RQ.IdEmployee = @param1 AND ' +
    '( RQD.SelectedDay = (SELECT cast (GETDATE() as DATE)) OR RQD.SelectedDay = (SELECT cast (GETDATE() + 1 as DATE)))',
    
    homeGetUserReleasedDays: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay ' +
    'FROM Place Pl, Parking P, ReleasedDays RD, Released R, Assignation A, Occupant O ' + 
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @param1 ' +
    'AND A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id ' +
    'AND ( RD.SelectedDay = (SELECT cast (GETDATE() as DATE)) OR RD.SelectedDay = (SELECT cast (GETDATE() + 1 as DATE)))',

    // RELEASES SCREEN ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET
    releaseGet: 'SELECT P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay ' +
    'FROM Place Pl, Parking P, ReleasedDays RD, Released R, Assignation A, Occupant O ' + 
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @param1 ' +
    'AND A.IdOccupant = O.Id AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    // INSERT
    releaseInsert: 'INSERT INTO Released (IdAssignation) OUTPUT INSERTED.id SELECT A.Id ' +
    'FROM Assignation A, Occupant O WHERE A.IdOccupant = O.Id AND O.IdUser = @IdUser',

    releaseDaysInsert: 'INSERT INTO ReleasedDays (IdReleased, SelectedDay) VALUES ',

    releaseDaysGet: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay ' +
    'FROM Place Pl, Parking P, ReleasedDays RD, Released R, Assignation A, Occupant O ' + 
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND O.IdUser = @param1 AND A.IdOccupant = O.Id ' +
    'AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id',

    // DELETE
    releaseDaysUpdateRequested: 'UPDATE RequestDays SET IdReleasedDay = null WHERE IdReleasedDay IN ( ' +
    'SELECT RD.Id FROM Released R, ReleasedDays RD WHERE R.Id = ( ' +
    'SELECT RD.IdReleased FROM Released R, ReleasedDays RD, RequestDays RQD, Occupant O, Assignation A ' +
    'WHERE RD.IdReleased = R.Id AND RD.SelectedDay = @Date AND O.IdUser = @IdUser AND ' +
    'A.IdOccupant = O.Id AND R.IdAssignation = A.Id GROUP BY RD.IdReleased) AND R.id = RD.IdReleased )',

    releaseDaysDelete: 'DELETE FROM ReleasedDays OUTPUT DELETED.IdReleased WHERE IdReleased IN ( ' +
        'SELECT R.Id FROM Occupant O, Assignation A, Released R, ReleasedDays RD ' +
        'WHERE O.IdUser = @IdUser02 AND A.IdOccupant = O.Id AND R.IdAssignation = A.Id ' +
        'AND RD.IdReleased = R.Id AND RD.SelectedDay = @Date02 )',
 
    releaseDelete: 'DELETE FROM Released WHERE Id = @IdReleased',

    // REQUESTS SCREEN //////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET
    requestGet: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName, RD.SelectedDay ' +
    'FROM Place Pl, Parking P, ReleasedDays RD, Released R, Assignation A, Request RQ, RequestDays RQD ' +
    'WHERE P.Id = Pl.IdParking AND Pl.Id = A.IdPlace AND R.IdAssignation = A.Id AND RD.IdReleased = R.Id ' +
    'AND RQD.IdReleasedDay = RD.Id AND RQ.Id = RQD.IdRequest AND RQ.IdEmployee = @param1',

    // INSERT
    requestInsert: 'INSERT INTO Request (IdEmployee) OUTPUT INSERTED.id VALUES (@IdUser)',

    requestDaysInsert: 'INSERT INTO RequestDays (IdRequest, SelectedDay) VALUES ',


    QueryFunction: QueryFunction,
};