-- Polls
INSERT INTO polls (id, title) VALUES
  (1, 'What do we have for dinner?'),
  (2, 'Which movie should we watch?'),
  (3, 'Where should we go for vacation?'),
  (4, 'What game should we play tonight?'),
  (5, 'Which book should we read next?');

-- Options (some with description, some without)
INSERT INTO options (id, poll_id, name, description) VALUES
  (1, 1, 'Pizza', 'Cheesy and delicious'),
  (2, 1, 'Steak', NULL),
  (3, 1, 'Salad', 'Fresh and healthy'),
  (4, 1, 'Pho', NULL),

  (5, 2, 'Inception', 'Mind-bending thriller'),
  (6, 2, 'The Lion King', NULL),
  (7, 2, 'Avengers: Endgame', 'Superhero epic'),

  (8, 3, 'Hawaii', NULL),
  (9, 3, 'Paris', 'City of lights'),
  (10, 3, 'Tokyo', NULL),
  (11, 3, 'Sydney', 'Harbor city'),
  (12, 3, 'Banff', NULL),

  (13, 4, 'Catan', NULL),
  (14, 4, 'Monopoly', 'Classic board game'),

  (15, 5, '1984', 'Dystopian classic'),
  (16, 5, 'To Kill a Mockingbird', NULL),
  (17, 5, 'The Hobbit', 'Fantasy adventure'),
  (18, 5, 'Pride and Prejudice', NULL);

-- Poll 1: All votes have names
INSERT INTO votes (poll_id, option_id, voter_name, score) VALUES
  (1, 1, 'Alice', 4), (1, 2, 'Alice', 3), (1, 3, 'Alice', 2), (1, 4, 'Alice', 1),
  (1, 4, 'Bob', 4), (1, 2, 'Bob', 3), (1, 1, 'Bob', 2), (1, 3, 'Bob', 1),
  (1, 2, 'Carol', 4), (1, 1, 'Carol', 3), (1, 4, 'Carol', 2), (1, 3, 'Carol', 1),
  (1, 3, 'Dave', 4), (1, 2, 'Dave', 3), (1, 1, 'Dave', 2), (1, 4, 'Dave', 1),
  (1, 1, 'Eve', 4), (1, 4, 'Eve', 3), (1, 2, 'Eve', 2), (1, 3, 'Eve', 1);

-- Poll 2: All votes are anonymous (no names)
INSERT INTO votes (poll_id, option_id, voter_name, score) VALUES
  (2, 5, NULL, 3), (2, 6, NULL, 2), (2, 7, NULL, 1),
  (2, 7, NULL, 3), (2, 5, NULL, 2), (2, 6, NULL, 1),
  (2, 6, NULL, 3), (2, 7, NULL, 2), (2, 5, NULL, 1),
  (2, 5, NULL, 3), (2, 7, NULL, 2), (2, 6, NULL, 1);

-- Poll 3: All votes have names
INSERT INTO votes (poll_id, option_id, voter_name, score) VALUES
  (3, 8, 'Judy', 5), (3, 9, 'Judy', 4), (3, 10, 'Judy', 3), (3, 11, 'Judy', 2), (3, 12, 'Judy', 1),
  (3, 12, 'Kevin', 5), (3, 11, 'Kevin', 4), (3, 10, 'Kevin', 3), (3, 9, 'Kevin', 2), (3, 8, 'Kevin', 1),
  (3, 10, 'Laura', 5), (3, 8, 'Laura', 4), (3, 9, 'Laura', 3), (3, 12, 'Laura', 2), (3, 11, 'Laura', 1),
  (3, 9, 'Mallory', 5), (3, 8, 'Mallory', 4), (3, 12, 'Mallory', 3), (3, 10, 'Mallory', 2), (3, 11, 'Mallory', 1),
  (3, 8, 'Nina', 5), (3, 10, 'Nina', 4), (3, 9, 'Nina', 3), (3, 12, 'Nina', 2), (3, 11, 'Nina', 1),
  (3, 11, 'Oscar', 5), (3, 10, 'Oscar', 4), (3, 12, 'Oscar', 3), (3, 8, 'Oscar', 2), (3, 9, 'Oscar', 1),
  (3, 12, 'Peggy', 5), (3, 8, 'Peggy', 4), (3, 9, 'Peggy', 3), (3, 10, 'Peggy', 2), (3, 11, 'Peggy', 1);

-- Poll 4: All votes are anonymous (no names)
INSERT INTO votes (poll_id, option_id, voter_name, score) VALUES
  (4, 13, NULL, 2), (4, 14, NULL, 1),
  (4, 14, NULL, 2), (4, 13, NULL, 1),
  (4, 13, NULL, 2), (4, 14, NULL, 1);

-- Poll 5: All votes have names
INSERT INTO votes (poll_id, option_id, voter_name, score) VALUES
  (5, 15, 'Trent', 4), (5, 16, 'Trent', 3), (5, 17, 'Trent', 2), (5, 18, 'Trent', 1),
  (5, 18, 'Uma', 4), (5, 17, 'Uma', 3), (5, 16, 'Uma', 2), (5, 15, 'Uma', 1),
  (5, 16, 'Victor', 4), (5, 18, 'Victor', 3), (5, 17, 'Victor', 2), (5, 15, 'Victor', 1),
  (5, 15, 'Wendy', 4), (5, 17, 'Wendy', 3), (5, 18, 'Wendy', 2), (5, 16, 'Wendy', 1),
  (5, 17, 'Xavier', 4), (5, 16, 'Xavier', 3), (5, 15, 'Xavier', 2), (5, 18, 'Xavier', 1),
  (5, 18, 'Yvonne', 4), (5, 17, 'Yvonne', 3), (5, 16, 'Yvonne', 2), (5, 15, 'Yvonne', 1);
