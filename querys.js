module.exports = {
    homeRequestDays: 'SELECT RD.SelectedDay FROM Request R, RequestDays RD WHERE R.IdEmployee = @IdUser AND R.Id = RD.IdRequest',
    homeGroup: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName FROM Place Pl, Parking P WHERE P.Id = Pl.IdParking AND Pl.Id IN ' +
    '( SELECT A.IdPlace FROM Assignation A WHERE A.IdOccupant = ( SELECT O.Id FROM Occupant O WHERE O.IdGroup = @IdGroup ) )',
    homeUser: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName FROM Place Pl, Parking P WHERE P.Id = Pl.IdParking AND Pl.Id IN ' +
    '( SELECT A.IdPlace FROM Assignation A WHERE A.IdOccupant = ( SELECT O.Id FROM Occupant O WHERE O.IdUser = @IdUser ) )',
    login: 'SELECT * FROM Employee WHERE UserName = @UserName AND UserPassword = @UserPassword',
    getRol: 'SELECT R.RolType FROM Rol R WHERE R.Id = ( SELECT RA.Rol FROM RolAssignation RA WHERE RA.IdEmployee = @IdUser )',
    
    
};