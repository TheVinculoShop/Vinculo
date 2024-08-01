import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import styled from 'styled-components';

const ProductCard = styled.div`
    display: flex;
    justify-content: center;
    width: 50%;
    padding: 10px;
    box-sizing: border-box;

    @media (min-width: 768px) {
        width: 25%;
    }

    @media (max-width: 767px) {
        width: 50%;
    }
`;

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export default function BoysProducts() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
        dispatch(getProducts(null, null, "Boys", null, currentPage));
    }, [error, dispatch, currentPage]);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Boys Products'} />
                    <h1 id="products_heading">Boys Products</h1>
                    <section id="products" className="container mt-5">
                        <Row>
                            {products && products.map(product => (
                                <ProductCard key={product._id}>
                                    <Product col={3} product={product} />
                                </ProductCard>
                            ))}
                        </Row>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div> : null}
                </Fragment>
            }
        </Fragment>
    );
}
