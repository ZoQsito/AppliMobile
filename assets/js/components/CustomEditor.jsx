import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EventFormABS, EventFormMI, EventFormREU } from './EventForm';



function CustomEditor(props) {
    const [selectedOption, setSelectedOption] = useState('');
  
    useEffect(() => {
      switch (props.props.edited.title) {
        case 'MI':
          setSelectedOption('MISSION');
          break;
        case 'REU':
          setSelectedOption('REUNION');
          break;
        case 'ABS':
          setSelectedOption('ABSENCE');
          break;
        default:
          setSelectedOption('');
      }
    }, []);
  
    const handleOptionChange = (event) => {
      const option = event.target.value;
      setSelectedOption(option);
    };
  
    return (
      <Card sx={{ width: '750px' }}>
        <CardContent>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {props.edited ? 'Modification d\'événement' : 'Ajout d\'événement'}
              </Typography>
              <IconButton edge="end" color="inherit" onClick={() => props.props.close()}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} sm={12} md={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Choisissez une option</InputLabel>
                <Select value={selectedOption} onChange={handleOptionChange}>
                  <MenuItem value="">Sélectionnez une option</MenuItem>
                  <MenuItem value="MISSION">MISSION</MenuItem>
                  <MenuItem value="REUNION">REUNION</MenuItem>
                  <MenuItem value="ABSENCE">ABSENCE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {selectedOption === 'MISSION' && (
            <EventFormMI
              props={props}
              setIsLoading={setIsLoading}
              edited={props.props.edited}
            />
          )}
          {selectedOption === 'REUNION' && (
            <EventFormREU
              props={props}
              setIsLoading={setIsLoading}
              edited={props.props.edited}
            />
          )}
          {selectedOption === 'ABSENCE' && (
            <EventFormABS
              props={props}
              setIsLoading={setIsLoading}
              edited={props.props.edited}
            />
          )}
        </CardContent>
      </Card>
    );
  }
  
  export default CustomEditor;