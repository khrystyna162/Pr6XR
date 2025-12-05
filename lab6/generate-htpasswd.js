import bcrypt from 'bcrypt';
import { writeFileSync } from 'fs';

const username = 'admin';
const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
  const htpasswd = `${username}:${hash}`;
  writeFileSync('.htpasswd', htpasswd);
  console.log('Generated .htpasswd file:');
  console.log(htpasswd);
  console.log('\nUsername:', username);
  console.log('Password:', password);
});
