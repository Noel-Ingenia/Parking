module.exports = {
    homeGroup: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName FROM Place Pl, Parking P WHERE P.Id = Pl.IdParking AND Pl.Id IN ' +
    '( SELECT A.IdPlace FROM Assignation A WHERE A.IdOccupant = ( SELECT O.Id FROM Occupant O WHERE O.IdGroup = @IdGroup ) )',
    homeUser: 'SELECT  P.ParkingName, P.MapUrl, Pl.PlaceName FROM Place Pl, Parking P WHERE P.Id = Pl.IdParking AND Pl.Id IN ' +
    '( SELECT A.IdPlace FROM Assignation A WHERE A.IdOccupant = ( SELECT O.Id FROM Occupant O WHERE O.IdUser = @IdUser ) )',
};