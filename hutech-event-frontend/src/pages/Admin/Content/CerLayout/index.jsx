import { useEffect, useState } from "react";
import { getCefTemplates } from "../../../../services/admin/cefTemplateService";
import AddCefLayout from "./AddCefLayout";
import DeleteCefLayout from "./DeleteCefLayout";
import EditCefLayout from "./EditCefLayout";

const Event = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [quantity, setQuantity] = useState(10); // Số bản ghi trên mỗi trang
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPage, setTotalPage] = useState(1); // Tổng số trang
  const [search, setSearch] = useState(""); // Từ khóa tìm kiếm
  const [showAddCefLayout, setShowAddCefLayout] = useState(false);
  const [deleteCefTemplateId, setDeleteCefTemplateId] = useState("");
  const [editCefLayout, setEditCefLayout] = useState(false);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await getCefTemplates();
        setData(data);
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [showAddCefLayout, deleteCefTemplateId, editCefLayout]);

  // Xử lý phân trang và tìm kiếm
  useEffect(() => {
    // Lọc theo từ khóa
    let filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Tính tổng số trang
    const pages = Math.ceil(filteredData.length / quantity);
    setTotalPage(pages);

    // Lấy dữ liệu trang hiện tại
    const startIndex = (page - 1) * quantity;
    const currentData = filteredData.slice(startIndex, startIndex + quantity);
    setTableData(currentData);
  }, [quantity, page, search, data]);

  // Xử lý chuyển trang
  const handleNextPage = () => {
    if (page < totalPage) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Xử lý thêm mẫu chứng nhận
  const handleAddCefLayout = async () => {
    setShowAddCefLayout(true);
  };

  const handleCloseAddCefLayout = () => {
    setShowAddCefLayout(false);
  };

  // Xử lý xóa mẫu chứng nhận
  const handleDeleteCefLayout = async (id) => {
    setDeleteCefTemplateId(id);
  };

  const handleCloseDeleteCefLayout = () => {
    setDeleteCefTemplateId("");
  };

  // Xử lý sửa mẫu chứng nhận
  const handleEditCefLayout = async (id) => {
    setEditCefLayout(id);
  };

  const handleCloseEditCefLayout = () => {
    setEditCefLayout("");
  };

  return (
    <div>
      {deleteCefTemplateId ? (
        <DeleteCefLayout
          id={deleteCefTemplateId}
          onClose={handleCloseDeleteCefLayout}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-20 rounded-md border-2 p-2 shadow-md"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>

              <div>
                <h1 className="text-2xl font-semibold">
                  Danh sách mẫu chứng nhận
                </h1>
                <p className="text-gray-500">Mẫu in chứng nhận cho sinh viên</p>
              </div>
            </div>
            <div>
              <button
                onClick={handleAddCefLayout}
                className="rounded-md bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-200"
              >
                Thêm mẫu mới
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-md bg-white p-4 shadow-md">
            <h1 className="text-2xl font-semibold text-gray-700">
              DANH SÁCH MẪU CHỨNG NHẬN
            </h1>

            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Xem</span>
                <select
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="rounded-md border-2 p-2 text-gray-500 hover:border-gray-700"
                  defaultValue={10}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
                <span className="text-gray-500">bản ghi</span>
              </div>
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Tìm kiếm mẫu"
                className="rounded-md border-2 p-2"
              />
            </div>
            <table className="mt-4 w-full">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">Tên mẫu chứng nhận</th>
                  <th className="text-left">Mặc định</th>
                  <th className="text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item._id}>
                    <td className="max-w-2 overflow-hidden text-ellipsis">
                      {item._id}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.isDefault ? "✅" : ""}</td>
                    <td>
                      <button
                        onClick={() => handleEditCefLayout(item._id)}
                        className="rounded-md bg-blue-500 p-1 text-white transition-all duration-300 ease-in-out hover:bg-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteCefLayout(item._id)}
                        className="ml-2 rounded-md bg-red-500 p-1 text-white transition-all duration-300 ease-in-out hover:bg-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex">
              {page > 1 && (
                <button
                  onClick={handlePreviousPage}
                  className="rounded-md bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-200"
                >
                  Trang trước
                </button>
              )}
              <div className="mx-2 rounded-md bg-white px-4 py-2 shadow-md">
                <span>{page}</span>
              </div>
              {page < totalPage && (
                <button
                  onClick={handleNextPage}
                  className="rounded-md bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-200"
                >
                  Trang sau
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddCefLayout && <AddCefLayout onClose={handleCloseAddCefLayout} />}
      {editCefLayout && (
        <EditCefLayout id={editCefLayout} onClose={handleCloseEditCefLayout} />
      )}
    </div>
  );
};

export default Event;
