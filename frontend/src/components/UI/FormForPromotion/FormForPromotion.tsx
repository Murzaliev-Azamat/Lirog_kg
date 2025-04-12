import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { PromotionApi } from '../../../types';
import { selectAddCategoryLoading } from '../../../store/categoriesSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCompanies } from '../../../store/companiesThunks';
import { selectCompanies } from '../../../store/companiesSlice';
import {
  addPromotion,
  editPromotion,
  fetchPromotionById,
  fetchPromotionsByAdmin,
} from '../../../store/promotionsThunks';
import { clearAllPromotions, selectPromotion } from '../../../store/promotionsSlice';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import './FormForPromotion.css';

const FormForPromotion = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const promotion = useAppSelector(selectPromotion);
  const companies = useAppSelector(selectCompanies);
  const addCategoryLoading = useAppSelector(selectAddCategoryLoading);

  const [state, setState] = useState<PromotionApi>({
    title: '',
    description: '',
    company: '',
    image: null,
    isAlways: '',
    isBirthday: false,
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPromotionById(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (promotion && params.id) {
      const formattedStartDate = promotion.startDate
        ? dayjs(promotion.startDate).format('YYYY-MM-DDTHH:mm')
        : undefined;
      const formattedEndDate = promotion.endDate ? dayjs(promotion.endDate).format('YYYY-MM-DDTHH:mm') : undefined;
      setState({
        title: promotion.title,
        description: promotion.description,
        company: promotion.company._id.toString(),
        image: promotion.image,
        isAlways: promotion.isAlways.toString(),
        isBirthday: promotion.isBirthday,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    } else {
      setState({
        title: '',
        description: '',
        company: '',
        image: null,
        isAlways: '',
        isBirthday: false,
        startDate: undefined,
        endDate: undefined,
      });
    }
  }, [promotion, params.id]);

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (params.id && promotion) {
      await dispatch(
        editPromotion({
          id: params.id,
          promotion: {
            title: state.title,
            description: state.description,
            company: state.company,
            image: state.image,
            isAlways: state.isAlways,
            isBirthday: state.isBirthday,
            startDate: state.startDate,
            endDate: state.endDate,
          },
        }),
      );
    } else {
      await dispatch(
        addPromotion({
          title: state.title,
          description: state.description,
          company: state.company,
          image: state.image,
          isAlways: state.isAlways,
          isBirthday: state.isBirthday,
          startDate: state.startDate,
          endDate: state.endDate,
        }),
      );
    }
    setState({
      title: '',
      description: '',
      company: '',
      image: null,
      isAlways: '',
      isBirthday: false,
      startDate: undefined,
      endDate: undefined,
    });
    await dispatch(clearAllPromotions());
    await dispatch(fetchPromotionsByAdmin());
    navigate('/admin/admin-promotion');
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const selectChangeHandler = (e: SelectChangeEvent) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const titleQuillChangeHandler = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  const descriptionQuillChangeHandler = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  const switchBirthday = () => {
    setState({ ...state, isBirthday: !state.isBirthday });
  };

  let disabled = false;

  if (addCategoryLoading) {
    disabled = true;
  }

  return (
    <form autoComplete="off" onSubmit={submitFormHandler} className="form">
      <Grid container direction="column" rowSpacing={2}>
        <Grid item style={{ width: '100%' }}>
          <InputLabel id="title">Название</InputLabel>
          <ReactQuill
            theme="snow"
            value={state.title}
            onChange={titleQuillChangeHandler}
            modules={{
              toolbar: [
                [{ header: [false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }], // Добавление модуля цвета текста
                [{ list: 'ordered' }, { list: 'bullet' }],
                // ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
          />
        </Grid>

        <Grid item style={{ width: '100%' }}>
          <InputLabel id="description">Описание</InputLabel>
          <ReactQuill
            theme="snow"
            value={state.description}
            onChange={descriptionQuillChangeHandler}
            modules={{
              toolbar: [
                [{ header: [false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }], // Добавление модуля цвета текста
                [{ list: 'ordered' }, { list: 'bullet' }],
                // ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
          />
        </Grid>

        <Grid item>
          <InputLabel id="company">Кампания</InputLabel>
          <Select
            labelId="company"
            sx={{ width: '100%' }}
            id="company"
            value={state.company}
            onChange={selectChangeHandler}
            name="company"
            required
          >
            {companies &&
              companies.map((company) => (
                <MenuItem value={company._id} key={company._id}>
                  {company.title}
                </MenuItem>
              ))}
          </Select>
        </Grid>

        <Grid item xs>
          <InputLabel id="isAlways">Статус</InputLabel>
          <Select
            labelId="isAlways"
            sx={{ width: '100%' }}
            id="isAlways"
            value={state.isAlways.toString()}
            onChange={selectChangeHandler}
            name="isAlways"
            required
          >
            <MenuItem value={true.toString()}>Постоянная акция</MenuItem>
            <MenuItem value={false.toString()}>Временная акция</MenuItem>
          </Select>
        </Grid>

        <Grid item>
          <InputLabel id="startDate">Начало акции</InputLabel>
          <TextField
            type={'datetime-local'}
            id="startDate"
            value={state.startDate || ''}
            onChange={inputChangeHandler}
            name="startDate"
          />
        </Grid>

        <Grid item>
          <InputLabel id="endDate">Конец акции</InputLabel>
          <TextField
            type={'datetime-local'}
            id="endDate"
            value={state.endDate || ''}
            onChange={inputChangeHandler}
            name="endDate"
          />
        </Grid>

        <Grid item>
          <FormControlLabel
            sx={{ paddingBottom: 2 }}
            control={<Switch onChange={switchBirthday} value={state.isBirthday} checked={state.isBirthday} />}
            label="Действует ли в Деньрождение?"
          />
        </Grid>
      </Grid>

      {params.id ? (
        <Button disabled={disabled} type="submit" color="primary" variant="contained">
          Edit promotion
        </Button>
      ) : (
        <Button disabled={disabled} type="submit" color="primary" variant="contained">
          Add promotion
        </Button>
      )}
    </form>
  );
};

export default FormForPromotion;
