CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL,

  email VARCHAR(255) NOT NULL UNIQUE,

  password_hash TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
)



CREATE TABLE applications(
  id SERIAL PRIMARY KEY,
  
  user_id INT NOT NULL REFERENCES users(id),

  job_title VARCHAR(255) NOT NULL CHECK(CHAR_LENGTH(job_title) >= 3),

  status VARCHAR(55) NOT NULL CHECK(status IN ('applied', 'interviewing', 'rejected')),

  company VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(company) >= 3),

  application_date DATE NOT NULL,

  reached_person VARCHAR(55),

  last_touch DATE,

  offer BOOLEAN DEFAULT false,

  rej_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  
  updated_at TIMESTAMPTZ DEFAULT now()
)




CREATE TABLE rounds (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  application_id INT NOT NULL,
  prepare_note TEXT,
  reflection_note TEXT,
  interview_number INT NOT NULL CHECK(interview_number > 0),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)