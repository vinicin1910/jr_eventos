-- backend/sql/schema.sql

-- Use no terminal: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS jr_brothers
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE jr_brothers;

-- (Copiar aqui exatamente as tabelas que te passei antes, em ordem)
-- championships, teams, championship_teams, athletes, registrations,
-- athlete_categories, brackets, bracket_entries, fights, podiums, team_scores
