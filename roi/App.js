// Import modules from React and React Native
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Defines the uri for the employee data
const uri = 'http://localhost:3000/employees';
// Imports the ROI logo
const roiLogo = require('./roi-logo.png'); 

// Creates a navigation stack for the application
const Stack = createStackNavigator();

// Home Page Component
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={roiLogo} style={styles.logoHome} resizeMode="contain" />
      <Text style={styles.homeText}>Welcome to Red Opal Innovation</Text>
      <Pressable
        onPress={() => navigation.navigate('Home Page')}
        style={styles.addButton}
      >
        <Text style={styles.buttonText}>STAFF DIRECTORY</Text>
      </Pressable>
      
    </View>
  );
}

// Staff Directory Component
function StaffDirectoryScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState();

  // Fetches the employee data from the API
  const fetchEmployees = () => {
    fetch(uri)
      .then((r) => r.json())
      .then((j) => {
        setEmployees(j);
      })
      .catch((e) => console.error(e.message));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  //Submits employee data - either add or update
  const submit = (data) => {
    let options = {
      method: data.id === -1 ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    const url = data.id === -1 ? uri : `${uri}/${data.id}`;

    fetch(url, options)
      .then((r) => r.json())
      .then((updatedEmployee) => {
        fetchEmployees();
        setEmployee();
      })
      .catch((e) => console.error(e.message));
  };

  // Removes employee
  const remove = (id) => {
    fetch(`${uri}/${id}`, { method: 'DELETE' })
      .then((r) => {
        fetchEmployees();
        setEmployee();
      })
      .catch((e) => console.error(e.message));
  };

  // Handles the button press on an employee name
  const handleEmployeePress = (employee) => {
    setEmployee(employee);
  };

  // Handles the button press on "Add New Staff"
  const handleAddPress = () => {
    // Sets the initial value for department as "select"
    setEmployee({ department: 'select' });
  };

  // Handles the button press on "Back"
  const handleBackPress = () => {
    setEmployee(undefined);
  };

  return (
<View style={styles.container}>
      <Image source={roiLogo} style={styles.logo} resizeMode="contain" />
      {employee === undefined ? (
        <View>
          <Pressable onPress={handleAddPress} style={styles.addButton}>
            <Text style={styles.buttonText}>ADD NEW STAFF</Text>
          </Pressable>

          <Text style={styles.staffText}>Staff Directory</Text>

          {employees.map((s) => (
            <Pressable
              key={s.id}
              style={styles.employee}
              onPress={() => handleEmployeePress(s)}
            >
              <Text style={styles.employeeText}>{`${s.firstName} ${s.lastName}`}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.buttonText}>BACK</Text>
          </Pressable>
          <Employee employee={employee} submit={submit} remove={remove} />
        </View>
      )}
    </View>
  );
}

// Function to display and edit employee details 
function Employee(props) {
  let id = props.employee?.id ?? -1;
  const [firstName, setFirstName] = useState(props.employee?.firstName ?? '');
  const [lastName, setLastName] = useState(props.employee?.lastName ?? '');
  const [phone, setPhone] = useState(props.employee?.phone ?? '');
  const [department, setDepartment] = useState(props.employee?.department ?? '0');
  const [streetAddress, setStreetAddress] = useState(
    props.employee?.streetAddress ?? ''
  );
  const [cityAddress, setCityAddress] = useState(props.employee?.cityAddress ?? '');
  const [stateAddress, setStateAddress] = useState(props.employee?.stateAddress ?? '');
  const [zipAddress, setZipAddress] = useState(props.employee?.zipAddress ?? '');
  const [countryAddress, setCountryAddress] = useState(
    props.employee?.countryAddress ?? ''
  );

  // Provides input fields and picker for employee data
  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>First Name:</Text>
        <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Last Name:</Text>
        <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Phone:</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.text}>Department:</Text>
        <Picker
          selectedValue={department}
          onValueChange={(itemValue, itemIndex) => setDepartment(itemValue)}
          style={styles.picker}
          itemStyle={department === 'select' ? styles.lightColorItem : undefined}
          >
          <Picker.Item label="Select" value="select" />
          <Picker.Item label="0: General" value="0" />
          <Picker.Item label="1: Information Communications Technology" value="1" />
          <Picker.Item label="2: Finance" value="2" />
          <Picker.Item label="3: Marketing" value="3" />
          <Picker.Item label="4: Human Resources" value="4" />
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.text}>Street Address:</Text>
        <TextInput
          value={streetAddress}
          onChangeText={setStreetAddress}
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>City:</Text>
        <TextInput value={cityAddress} onChangeText={setCityAddress} style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>State:</Text>
        <TextInput value={stateAddress} onChangeText={setStateAddress} style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Zip:</Text>
        <TextInput value={zipAddress} onChangeText={setZipAddress} style={styles.input} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.text}>Country:</Text>
        <TextInput
          value={countryAddress}
          onChangeText={setCountryAddress}
          style={styles.input}
        />
      </View>

      <Pressable
        onPress={() =>
          props.submit({
            id,
            firstName,
            lastName,
            phone,
            department,
            streetAddress,
            cityAddress,
            stateAddress,
            zipAddress,
            countryAddress,
          })
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>{id === -1 ? 'ADD' : 'UPDATE STAFF'}</Text>
      </Pressable>
      {id > -1 && (
        <Pressable onPress={() => props.remove(id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>DELETE STAFF</Text>
        </Pressable>
      )}
    </View>
  );
}

// Main app component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'HOME',
            headerStyle: {
              backgroundColor: '#3b3b3b', // Set your desired background color
            },
            headerTintColor: '#fff', // Set your desired text color
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="Home Page"
          component={StaffDirectoryScreen}
          options={{
            title: 'HOME PAGE',
            headerStyle: {
              backgroundColor: '#3b3b3b', // Set your desired background color
            },
            headerTintColor: '#fff', // Set your desired text color
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    padding: 30,
    paddingTop: Platform.OS === 'ios' ? 40 : 0, 
  },
  // Style for "Add New Staff" button
  addButton: {
    borderWidth: 3,
    borderColor: '#262626',
    backgroundColor: '#3b3b3b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center', 
  },
// Style for "Back" button
  backButton: {
    borderWidth: 3,
    backgroundColor: '#c64c38',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  // Default text style for button if not customised
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Style for "Staff Directory" heading text
  staffText: {
    color: '#262626',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    padding: 5,
    margin: 5,
  },
  // Style for "Welcome to Red Opal Innovation" heading text
  homeText: {
    color: '#262626',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    textTransform: 'capitalize',
    padding: 5,
    margin: 5,
  },
  // Style for the employee name buttons in the Staff Directory
  employee: {
    borderWidth: 3,
    borderColor: '#262626',
    margin: 5,
    padding: 10,
    backgroundColor: '#cb6d4f',
    borderRadius: 8,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  // Style for the employee name text in the Staff Directory
  employeeText: {
    color: '#262626',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Style for the form
  form: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 15,
    borderRadius: 8,
    margin: 10,
  },
  // Style for the ROI logo
  logo: {
    width: '100%', 
    height: 80, 
    marginBottom: 20,
    marginTop: 20,
  },
  // Style for the ROI logo on the Home Page 
  logoHome: {
    width: '100%', 
    height: 100, 
    marginBottom: 50,
    marginTop: 80,
  },
  // Style for the detail names in the form
  text: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'left',
  },
  // Style for the input fields in the form
  input: {
    borderWidth: 2,
    borderColor: '#000',
    flexGrow: 1,
    padding: 2.5,
    borderRadius: 2.5,
    marginLeft: 5,
    minWidth: '72%',
    textAlign: 'left',
    backgroundColor: '#fff',
    fontSize: 12,
  },
  // Style for the input groups in the form
  inputGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  // Style for the buttons in the form
  button: {
    backgroundColor: '#3b3b3b',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  // Style for the "Delete Staff" button
  deleteButton: {
    backgroundColor: '#941a1d',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  // Style for the "Department" picker box
  picker: {
    borderWidth: 2,
    borderColor: '#000',
    flexGrow: 1,
    padding: 2.5,
    borderRadius: 2.5,
    marginLeft: 5,
    minWidth: '72%',
    textAlign: 'left',
    backgroundColor: '#fff',
    fontSize: 12,
  },
  // Style for the colour of the chosen item in the picker box
  lightColorItem: {
    color: '#fff',
  },
});
