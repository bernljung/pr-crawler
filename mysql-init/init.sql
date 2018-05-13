use market_data;

DROP TABLE IF EXISTS crawler_queue;

CREATE TABLE crawler_queue (
  id int NOT NULL AUTO_INCREMENT,
  url VARCHAR(2000) NOT NULL,
  prio int NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (url)
);

DROP TABLE IF EXISTS press_releases;

CREATE TABLE press_releases (
  id int NOT NULL AUTO_INCREMENT,
  event_date TIMESTAMP,
  corporation VARCHAR(255),
  text TEXT,
  url VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (url)
);