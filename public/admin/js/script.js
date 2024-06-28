// Button Status
const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length > 0){
    let url = new URL(window.location.href); 
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status")
            
            if(status) {
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status")
            }
            window.location.href = url.href;
        });
    });
}

// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search")
if (formSearch) {
    let url = new URL(window.location.href);
        formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        // Ngăn không cho load lại trang
     
        const keyword = e.target.elements.keyword.value
        if(keyword) {
            url.searchParams.set("keyword", keyword)
        }
        else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href;
    })
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")
            
            url.searchParams.set("page", page)
            window.location.href = url.href;
        })
    })
}
// End Pagination

// Check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    // console.log(inputsId)
    
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
           inputsId.forEach(input => {
            input.checked = true;
           })
                     
        } else {
            inputsId.forEach(input => {
                input.checked = false;
               })
        }
    
    })
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            // console.log(countChecked)
            // console.log(inputsId.length)

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } 
            else {
                inputCheckAll.checked = false;
            }
           
        })
    })
}
// End Check box multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        
        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có xác nhận xóa không?")
        
            if(!isConfirm) {
                return;
            }
        
        }
           
        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    
                    ids.push(`${id}-${position}`)
                } else {
                    ids.push(id);
                }
                
            })
            
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else 
        {
            alert("Vui lòng chọn ít nhất một bản ghi")
        }
    })
}
// End Form Change Multi


// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
    
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    uploadImageInput.addEventListener("change", (e) => {
        // console.log(e)
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })
}
// End Upload Image

// Sort

const sort = document.querySelector("[sort]")
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]")
    const sortClear = sort.querySelector("[sort-clear]")
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-"); 

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        window.location.href = url.href;
    
    
    });

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected = true;
    }
}
// End Sort
