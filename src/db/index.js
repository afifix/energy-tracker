const schema = `
CREATE TABLE IF NOT EXISTS groups(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
	last_modified	INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS meters(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  no TEXT,
  unit TEXT,
  cost REAL,
  start_value REAL,
  description TEXT,
  user TEXT,
  group_id INTEGER,
  last_modified	INTEGER DEFAULT (strftime('%s', 'now'))
);
`;

const upgrades = [
  // {
  //   fromVersion: 1,
  //   toVersion: 10,
  //   statement: statement_v10,
  //   // required, to update database version
  //   set: [
  //     {
  //       statement: "SELECT id FROM users",
  //       values: [],
  //     },
  //   ],
  // },
];

const getUpgrade = ({ fromVersion, toVersion }) => {
  return upgrades.find(
    (u) => u.fromVersion === fromVersion && u.toVersion === toVersion
  );
};

export default {
  name: "db",
  version: 2,
  schema,
  getUpgrade,
};
