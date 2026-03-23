import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type Player = {
    name : Text;
    score : Nat;
  };

  module Player {
    public func compare(player1 : Player, player2 : Player) : Order.Order {
      switch (Text.compare(player1.name, player2.name)) {
        case (#equal) { Nat.compare(player1.score, player2.score) };
        case (order) { order };
      };
    };
  };

  type Mission = {
    id : Text;
    playerName : Text;
    completed : Bool;
  };

  module Mission {
    public func compare(mission1 : Mission, mission2 : Mission) : Order.Order {
      switch (Text.compare(mission1.id, mission2.id)) {
        case (#equal) { Text.compare(mission1.playerName, mission2.playerName) };
        case (order) { order };
      };
    };
  };

  let playerMap = Map.empty<Text, Player>();
  let missionMap = Map.empty<Text, Mission>();

  public shared ({ caller }) func createOrUpdatePlayer(player : Player) : async () {
    playerMap.add(player.name, player);
  };

  public shared ({ caller }) func createOrUpdateMission(mission : Mission) : async () {
    missionMap.add(mission.id, mission);
  };

  public query ({ caller }) func getPlayerByName(name : Text) : async Player {
    switch (playerMap.get(name)) {
      case (null) { Runtime.trap("This player does not exist!") };
      case (?player) { player };
    };
  };

  public query ({ caller }) func getMissionById(id : Text) : async Mission {
    switch (missionMap.get(id)) {
      case (null) { Runtime.trap("This mission does not exist!") };
      case (?mission) { mission };
    };
  };

  public query ({ caller }) func getAllPlayers() : async [Player] {
    playerMap.values().toArray().sort();
  };

  public query ({ caller }) func getAllMissions() : async [Mission] {
    missionMap.values().toArray().sort();
  };
};
