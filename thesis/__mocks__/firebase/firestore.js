const getFirestore = jest.fn(() => {
  return {};
});

const collection = jest.fn(() => {
  return {};
});

const query = jest.fn(() => {
  return {};
});

const where = jest.fn(() => {
  return {};
});

const getDocs = jest.fn(async () => {
  return {
    docs: [
      {
        id: "1",
        data: () => ({
          name: "Doctor 1",
          surname: "Surname 1",
          email: "doctor1@email.com",
        }),
      },
    ],
  };
});

const doc = jest.fn(() => {
  return {};
});

const addDoc = jest.fn(async () => {
  return {};
});

const setDoc = jest.fn(async () => {
  return {};
});

const getDoc = jest.fn(async () => {
  return {
    exists: () => true,
    data: () => ({
      name: "John",
      surname: "Doe",
      email: "johndoe@email.com",
    }),
  };
});

const updateDoc = jest.fn(async () => {
  return {};
});

module.exports = {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
};
