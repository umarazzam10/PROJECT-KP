'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Pegawais', [
      { NIP: '196910161998032001', nama: 'Dr. Nelly Florida Riama, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196004061981031003', nama: 'Dr. Widada Sulistya, DEA', role: 'user', createdAt: new Date(),updatedAt: new Date() , createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196002201983031001', nama: 'Dr. Mulyono R. Prabowo, M.Sc', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198401242006041002', nama: 'Dr. Achmad Supandi, S.Kom., MMSI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196508051988121001', nama: 'Agus Prasisto, ST., MM', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198006172006041006', nama: 'Adityawarman, MM', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199406052013121001', nama: 'Ali Azimi, S.Tr', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198510292008122001', nama: 'Amalia Solicha, S.Kom., MTI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198106022005022001', nama: 'Anni Arumsari Fitriany, S.Si., ME', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197906302006041005', nama: 'Arisman, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198012122006041001', nama: 'Asep Jamaludin Malik, S.Si., M.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197603251999031001', nama: 'Chandra Adyanto', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198010302002121001', nama: 'Deni Saiful, S.Kom., MMSI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199105222015022001', nama: 'Desy Purbandari, S.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199908012021062001', nama: 'Dinda Afifah, S.Tr.Met', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198202162006041004', nama: 'Eko Haryanto, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198201142005022001', nama: 'Ika Nurmalasari, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197612151998031001', nama: 'Imbuh Yuwono, SP., M.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196706161996031001', nama: 'Juniarto Widodo, ST., MM', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197905042006041007', nama: 'Kadnan, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199502132014111001', nama: 'Khafid Rizki Pratama, S.Tr', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197610301997031001', nama: 'Kurnia Hadi Sutrisno, ST', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198112272006042005', nama: 'Madona, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196607021990032001', nama: 'M.S Yuliyanti, S.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198207052006042004', nama: 'Nina Amelia Sasmita, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198005242008012024', nama: 'Nurahmini, S.Sos., M.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '196705071992021001', nama: 'Nurhidayat, ST., M.Sc', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197306121998032001', nama: 'Nursamsidah', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197203221995032001', nama: 'Pudji Setiyani, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198606262008012003', nama: 'Ratih Prasetya, S.Si., MMSI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199808242021062001', nama: 'Rantifa Eka Agustira, S.Tr.Met', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199201042012101001', nama: 'Rifki Priansyah Jasin, SST', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197607031998032001', nama: 'Rr. Yuliana Purwanti, M.Si', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198002052008121001', nama: 'Rony Kasmanto, ST., MTI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197907192005012012', nama: 'Sarimang Aisyah Jamco, S.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199009282015021003', nama: 'Septian Bagus Wicaksono, S.Kom., MTI', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199807122021061001', nama: 'Syarif Hidayatullah, S.Tr.Instr', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '198004172008122001', nama: 'Widarsih Ariessanti, S.Ak', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199807222023212006', nama: 'Titah Lailiyah, S.Kom', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199407312023211007', nama: 'Yulyanto Dwi Prastyo Nugroho, S.Pd', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199208152023211018', nama: 'I Dewa Putra Pradhnadita, S.Kom', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199102112023211021', nama: 'Hadirman Lombu, A.Md', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197206251995032001', nama: 'Iky Asih Mariani, MT', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197908042006042001', nama: 'Tri Istiana', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '197701261999031001', nama: 'Dudi Rojudin, ST', role: 'user', createdAt: new Date(),updatedAt: new Date()  },
      { NIP: '199205192012102001', nama: 'Intan Prayuda Wulandari', role: 'user', createdAt: new Date(),updatedAt: new Date()  }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Pegawais', null, {});
  }
};
