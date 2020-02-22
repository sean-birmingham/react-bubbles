import React, { useState } from 'react';
import { axiosWithAuth } from '../utils/axiosWithAuth';

const initialColor = {
  color: '',
  code: { hex: '' }
};

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);

  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post('http://localhost:5000/api/colors', newColor)
      .then(res => {
        updateColors([...colors, newColor]);
      });
  };

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        updateColors(
          colors.map(color => {
            if (color.id === res.data.id) {
              return res.data;
            } else {
              return color;
            }
          })
        );
      });
  };

  const deleteColor = color => {
    axiosWithAuth()
      .delete(`colors/${color.id}`)
      .then(() => {
        axiosWithAuth()
          .get(`http://localhost:5000/api/colors/`)
          .then(res => {
            updateColors(res.data);
          });
      })
      .catch(err => {
        console.log('error deleting color', err);
      });
  };

  return (
    <div className='colors-wrap'>
      <form onSubmit={addColor}>
        <legend>add color</legend>
        <label>color name: </label>
        <input
          type='text'
          value={newColor.color}
          onChange={e => setNewColor({ ...newColor, color: e.target.value })}
        />
        <label>hex code: </label>
        <input
          type='text'
          value={newColor.code.hex}
          onChange={e =>
            setNewColor({ ...newColor, code: { hex: e.target.value } })
          }
        />
        <button type='submit'>Submit</button>
      </form>
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className='delete'
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}>
                x
              </span>{' '}
              {color.color}
            </span>
            <div
              className='color-box'
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className='button-row'>
            <button type='submit'>save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className='spacer' />
    </div>
  );
};

export default ColorList;
