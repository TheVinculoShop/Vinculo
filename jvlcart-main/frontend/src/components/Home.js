import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';

export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('');

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            })
        }
        dispatch(getProducts(null, null, null, category, currentPage))
    }, [error, dispatch, currentPage, category])

    const handleCategoryClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setCurrentPage(1);
    }

    return (
        <Fragment>
             {/* Categories */}
<center>
    <div className="container mt-5">
        <div className="row">
            <div className="col-12 mb-5">
                <h1 id="products_heading">Categories</h1>

                <div className="image-container">
                    <img 
                        src="/images/girlscategory_img.jpg" 
                        alt="Girls Category"
                        onClick={() => handleCategoryClick('girls')}
                    />
                    <div class="label">Girls</div>
                    </div>

                    <div  className="image-container">
                    <img 
                        src="/images/boyscategory_img.jpeg" 
                        alt="Boys Category"
                        onClick={() => handleCategoryClick('boys')}
                    />
                      <div class="label">Boys</div>

                    </div>

                    <div  className="image-container">
                    <img 
                        src="/images/infantcategory_img.jpeg" 
                        alt="Infants Category"
                        onClick={() => handleCategoryClick('infants')}
                    />
                    <div class="label">Infant</div>
                </div>
            </div>
        </div>
    </div>
</center>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                  <center><h1 id="products_heading">Latest Products</h1></center>  
                    


                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product col={3} key={product._id} product={product} />
                            ))}
                        </div>
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
    )
}