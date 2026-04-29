import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const colleges = [
    {
      name: 'Indian Institute of Technology Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 250000,
      placementRate: 98.5,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'IIT Bombay is an autonomous public institute of higher education and research in Mumbai, Maharashtra, India.',
      courses: JSON.stringify(['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering']),
    },
    {
      name: 'Birla Institute of Technology and Science',
      location: 'Pilani, Rajasthan',
      fees: 450000,
      placementRate: 95.0,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'BITS Pilani is a private deemed university in Pilani, India. It focuses primarily on higher education and research in engineering and sciences.',
      courses: JSON.stringify(['Computer Science', 'Chemical Engineering', 'Physics', 'Information Systems']),
    },
    {
      name: 'Delhi Technological University',
      location: 'New Delhi, Delhi',
      fees: 180000,
      placementRate: 92.5,
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1592284328531-e3ebbd609805?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'DTU, formerly Delhi College of Engineering, is a state university located in New Delhi, India.',
      courses: JSON.stringify(['Software Engineering', 'Electronics', 'Mechanical', 'Biotechnology']),
    },
    {
      name: 'Vellore Institute of Technology',
      location: 'Vellore, Tamil Nadu',
      fees: 300000,
      placementRate: 90.0,
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'VIT is a private research deemed university located in Vellore, India.',
      courses: JSON.stringify(['Computer Science', 'Data Science', 'IT', 'Robotics']),
    },
    {
      name: 'National Institute of Technology Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      fees: 150000,
      placementRate: 96.0,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'NIT Trichy is a public technical and research university near the city of Tiruchirappalli in Tamil Nadu, India.',
      courses: JSON.stringify(['Computer Science', 'Civil Engineering', 'Metallurgical Engineering', 'Architecture']),
    }
  ];

  for (const college of colleges) {
    await prisma.college.create({
      data: college
    });
  }
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
