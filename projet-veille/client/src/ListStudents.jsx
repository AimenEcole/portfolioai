import { useState, useEffect } from 'react';

const StudentCard = (props)  => (
  <div className="bg-white dark:bg-gray-700 bg-opacity-75 border border-gray-300 dark:border-gray-600 shadow-lg p-4 m-2 rounded-md text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer">
    <div className="font-bold text-lg">{`${props.student.prenom} ${props.student.nom}`}</div>
    <div className="text-gray-700 dark:text-gray-300">{`Prix: ${props.student.prix}$`}</div>
    <a href={`https://github.com/${props.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{`Github: ${props.student.github}`}</a>
    <p className="text-gray-700 dark:text-gray-300">{`École: ${props.student.ecole}`}</p>
  </div>
);

export default function ListStudents(props){
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(props.students);
  const [filteredStudents, setFilteredStudents] = useState(props.students);
  const [theme, setTheme] = useState('light'); // Theme state

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = students.filter(item => {
      return Object.keys(item).some(key =>
        typeof item[key] === "string" && item[key].toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredStudents(filteredData);
  }, [searchTerm, students]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  const sortStudents = (criteria) => {
    let sortedStudents = [...filteredStudents];
    if (criteria === 'name') {
      sortedStudents.sort((a, b) => `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`));
    } else if (criteria === 'price') {
      sortedStudents.sort((a, b) => a.prix - b.prix);
    }
    setFilteredStudents(sortedStudents);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'}>
      <div className="flex flex-col md:flex-row justify-between items-center p-4">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Meet Our Interns</h1>
        <div className="flex items-center">
          <select 
            className="bg-gray-200 dark:bg-gray-600 p-2 rounded mr-4" 
            onChange={(e) => sortStudents(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
          <input 
            type="text" 
            placeholder="Search..." 
            className="p-2 rounded"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={toggleTheme} 
            className="ml-4 bg-gray-200 dark:bg-gray-600 p-2 rounded"
          >
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 place-items-center p-4">
        {filteredStudents.map(student => <StudentCard key={student.id} student={student} />)}
      </div>
    </div>
  );
}
