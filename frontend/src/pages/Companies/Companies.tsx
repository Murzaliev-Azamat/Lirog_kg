import React from 'react';
import { selectCompanies, selectFetchAllLoading, selectHasMoreCompany } from '../../store/companiesSlice';
import { fetchCompanies, fetchCompaniesByCategory, fetchCompaniesBySearch } from '../../store/companiesThunks';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CardForCompany from '../../components/UI/CardForCompany/CardForCompany';
import AdvBlock from '../../components/UI/AdvBlock/AdvBlock';
import InfiniteScroll from 'react-infinite-scroller';
import { selectFilterCategory, selectFilterSubCategory } from '../../store/filterSlice';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { selectSearch, setSearch } from '../../store/searchSlice';
import Spinner from '../../components/UI/Spinner/Spinner';

const Search = styled('div')(({ theme }) => ({
  backgroundColor: 'black',
  opacity: '0.3',
  flexGrow: 1,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    opacity: '0.5',
    backgroundColor: 'black',
  },
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  color: 'white',
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '100%',
  color: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Companies = () => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectCompanies);
  const hasMoreCompany = useAppSelector(selectHasMoreCompany);
  const fetchAllLoading = useAppSelector(selectFetchAllLoading);
  const filterCategory = useAppSelector(selectFilterCategory);
  const filterSubcategory = useAppSelector(selectFilterSubCategory);
  const search = useAppSelector(selectSearch);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loadMore = async () => {
    if (fetchAllLoading) {
      return;
    } else {
      if (filterCategory !== '' && filterSubcategory === '') {
        await dispatch(fetchCompaniesByCategory({ category: filterCategory }));
      } else if (filterSubcategory !== '') {
        await dispatch(fetchCompaniesByCategory({ category: filterSubcategory }));
      } else if (search !== '') {
        await dispatch(fetchCompaniesBySearch({ search: search }));
      } else {
        await dispatch(fetchCompanies());
      }
    }
  };

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearch(value));
  };

  const urlImage = isMobile
    ? '/mobile_banner.png'
    : 'https://www.ts.kg/olol1/e6365698226d52c6d440fdac8cfa724a57dfa748.jpg';

  return (
    <AdvBlock urlImage={urlImage}>
      <Box sx={{ display: { xs: 'block', web: 'none' }, width: '17.95rem', margin: '0px auto' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" onChange={onTextFieldChange} />
        </Search>
      </Box>
      <InfiniteScroll
        // pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreCompany}
        loader={<Spinner key={0} />}
        // useWindow={false}
      >
        <div className="row p-2 gx-0 justify-content-evenly justify-content-sm-start">
          {companies.map((company) => (
            <CardForCompany
              key={company._id}
              title={company.title}
              link={company.link}
              image={company.image}
              id={company._id}
            />
          ))}
        </div>
      </InfiniteScroll>
    </AdvBlock>
  );
};

export default Companies;
