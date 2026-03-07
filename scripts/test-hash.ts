import bcrypt from 'bcryptjs';

async function test() {
  const hash = '$2b$10$QvKeqovqZMpNucYCZ65tNeiHxPxQe6dwCxD31RmuksPaDOQvCgGEO';
  const match = await bcrypt.compare('admin@br', hash);
  console.log('Match:', match);
}

test();
