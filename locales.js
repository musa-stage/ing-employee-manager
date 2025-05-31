// locales.js
const translations = {
  en: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    department: 'Department',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    confirmDelete: 'Are you sure you want to delete this employee?',
    confirmUpdate: 'Are you sure you want to update this employee?',
    save: 'Save',
    cancel: 'Cancel',
    dob: 'Date of Birth',
    doe: 'Date of Employment',
    phone: 'Phone Number',
    countryCode: 'Country Code',
    phoneNumber: 'Phone Number',
    position: 'Position'
  },
  tr: {
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    department: 'Departman',
    actions: 'İşlemler',
    edit: 'Düzenle',
    delete: 'Sil',
    search: 'Ara',
    confirmDelete: 'Bu çalışanı silmek istediğinize emin misiniz?',
    confirmUpdate: 'Bu çalışanı güncellemek istediğinize emin misiniz?',
    save: 'Kaydet',
    cancel: 'İptal',
    dob: 'Doğum Tarihi',
    doe: 'İşe Başlama Tarihi',
    phone: 'Telefon Numarası',
    countryCode: 'Ülke Kodu',
    phoneNumber: 'Telefon Numarası',
    position: 'Pozisyon'
  }
};

export const t = (key) => {
  const lang = document.documentElement.lang || 'en';
  return translations[lang][key] || key;
};
