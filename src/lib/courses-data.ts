import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface Topic {
  id: string;
  title: string;
  videoId: string;
  transcript: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageId: string;
  detailImageIds: string[];
  topics: Topic[];
}

const getImage = (id: string): ImagePlaceholder => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        return {
            id: 'not-found',
            imageUrl: 'https://picsum.photos/seed/error/600/400',
            imageHint: 'not found',
            description: 'Image not found'
        }
    }
    return image;
}

export const coursesData: Course[] = [
  {
    id: 'cosmic-voyages',
    title: 'Cosmic Voyages',
    description: 'Explore the vastness of space, from our solar system to distant galaxies. Understand the lifecycle of stars, black holes, and the mysteries of the universe.',
    imageId: 'cosmic-voyages',
    detailImageIds: ['cosmic-voyages-1', 'cosmic-voyages-2'],
    topics: [
      {
        id: 't1',
        title: 'Introduction to the Solar System',
        videoId: 'libKVRa01L8',
        transcript: 'Our solar system is a vast place, with the sun at its center. Eight planets orbit this star, each with unique characteristics. Mercury, Venus, Earth, and Mars are the inner, rocky planets. Jupiter and Saturn are the outer gas giants, while Uranus and Neptune are the ice giants. Beyond Neptune lies the Kuiper Belt, home to dwarf planets like Pluto.',
      },
      {
        id: 't2',
        title: 'The Lifecycle of a Star',
        videoId: 'PM9CQDlQI0A',
        transcript: 'Stars are born from nebulas, vast clouds of gas and dust. Gravity pulls this material together, forming a protostar. When the core becomes hot and dense enough, nuclear fusion begins, and a star is born. The star then enters the main sequence phase, where it will spend most of its life. The fate of a star depends on its mass. Smaller stars like our sun will become white dwarfs, while massive stars can explode in a supernova, leaving behind a neutron star or a black hole.',
      },
    ],
  },
  {
    id: 'quantum-physics',
    title: 'Quantum Physics',
    description: 'Delve into the strange and wonderful world of quantum mechanics. Learn about wave-particle duality, quantum superposition, and entanglement.',
    imageId: 'quantum-physics',
    detailImageIds: ['quantum-physics-1', 'quantum-physics-2'],
    topics: [
      {
        id: 't1',
        title: 'Wave-Particle Duality',
        videoId: 'qCm_q10aIcA',
        transcript: 'One of the foundational principles of quantum mechanics is wave-particle duality. It states that particles like electrons and photons can exhibit both wave-like and particle-like properties. For example, in the double-slit experiment, single particles are observed to create an interference pattern, which is characteristic of waves. However, when observed, they behave as individual particles.',
      },
      {
        id: 't2',
        title: 'Quantum Superposition',
        videoId: 'm0kGaes2gko',
        transcript: 'Superposition is the idea that a quantum system can be in multiple states at the same time. It is only when we measure the system that it collapses into a single, definite state. A famous thought experiment to illustrate this is Schrödinger\'s cat, where a cat in a box is simultaneously alive and dead until the box is opened.',
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI and Machine Learning',
    description: 'Understand the fundamentals of Artificial Intelligence and Machine Learning. Discover how algorithms learn from data to make predictions and decisions.',
    imageId: 'ai-ml',
    detailImageIds: [],
    topics: [
      {
        id: 't1',
        title: 'What is Machine Learning?',
        videoId: 'ukzFI9rgMBI',
        transcript: 'Machine learning is a subset of artificial intelligence where algorithms are trained on data to learn patterns and make predictions. There are three main types: supervised learning, where the model learns from labeled data; unsupervised learning, where it finds patterns in unlabeled data; and reinforcement learning, where an agent learns to make decisions by receiving rewards or penalties.',
      },
      {
        id: 't2',
        title: 'Neural Networks Explained',
        videoId: 'bfmFfD2RIcg',
        transcript: 'Neural networks are a key component of deep learning, a subfield of machine learning. Inspired by the human brain, they consist of layers of interconnected nodes, or neurons. Each connection has a weight that is adjusted during training. As data passes through the network, these neurons process information, allowing the network to learn complex patterns for tasks like image recognition or natural language processing.',
      },
    ],
  },
  {
    id: 'ancient-civilizations',
    title: 'Ancient Civilizations',
    description: 'Journey back in time to explore the rise and fall of great ancient civilizations. Learn about their culture, technology, and lasting impact on the world.',
    imageId: 'ancient-civilizations',
    detailImageIds: [],
    topics: [
      {
        id: 't1',
        title: 'The Greatness of Ancient Egypt',
        videoId: 'hO1tzmi1V5g',
        transcript: 'Ancient Egypt, flourishing for millennia along the Nile River, is renowned for its monumental architecture, such as the pyramids and the Sphinx. Their society was deeply religious, with a complex pantheon of gods and elaborate burial rituals, including mummification. They developed a form of writing known as hieroglyphics and made significant advances in mathematics, medicine, and astronomy.',
      },
    ],
  },
  {
    id: 'electronics-fundamentals',
    title: 'Electronics Fundamentals',
    description: 'Learn the basics of electronics, from simple components like diodes and capacitors to more complex topics like modulation and RFID.',
    imageId: 'electronics-fundamentals',
    detailImageIds: [],
    topics: [
      {
        id: 'ef-t1',
        title: 'Modulation',
        videoId: 'mHvV_Tv8HDQ',
        transcript: 'Modulation is the process of varying one or more properties of a periodic waveform, called the carrier signal, with a modulating signal that typically contains information to be transmitted.',
      },
      {
        id: 'ef-t2',
        title: 'Multiplexing',
        videoId: 'WXof7bg_Zys',
        transcript: 'In telecommunications and computer networks, multiplexing is a method by which multiple analog or digital signals are combined into one signal over a shared medium.',
      },
      {
        id: 'ef-t3',
        title: 'RFID',
        videoId: 'Ukfpq71BoMo',
        transcript: 'Radio-Frequency Identification (RFID) uses electromagnetic fields to automatically identify and track tags attached to objects. The tags contain electronically stored information.',
      },
      {
        id: 'ef-t4',
        title: 'Capacitor',
        videoId: 'X4EUwTwZ110',
        transcript: 'A capacitor is a device that stores electrical energy in an electric field. It is a passive electronic component with two terminals.',
      },
      {
        id: 'ef-t5',
        title: 'Transistor',
        videoId: 'YtM_MnM0qT4',
        transcript: 'A transistor is a semiconductor device used to amplify or switch electronic signals and electrical power. It is composed of semiconductor material usually with at least three terminals for connection to an external circuit.',
      },
      {
        id: 'ef-t6',
        title: 'Rectifier',
        videoId: 'n9FxHA7pl6o',
        transcript: 'A rectifier is an electrical device that converts alternating current (AC), which periodically reverses direction, to direct current (DC), which flows in only one direction.',
      },
      {
        id: 'ef-t7',
        title: 'Diode',
        videoId: 'Fwj_d3uO5g8',
        transcript: 'A diode is a two-terminal electronic component that conducts current primarily in one direction; it has low resistance in one direction, and high resistance in the other.',
      },
    ],
  },
];
