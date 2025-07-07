import { Form, Input, message, Modal, Spin, Upload } from "antd";
import { useState } from "react";
import { useAddCategoryMutation } from "../redux/api/categoryApi";

export const AddCategories = ({ openAddModal, setOpenAddModal }) => {
  const [addCategory] = useAddCategoryMutation();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append("name", values?.name);
    formData.append("details", values?.details);

    fileList.forEach((file) => {
      formData.append("image", file.originFileObj);
    });
    setLoading(true);

    addCategory(formData)
      .then((response) => {
       
        setOpenAddModal(false);

        if (response) {
          message.success(response?.data?.message);
          form.resetFields();
        }
        setFileList([]);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error?.data?.message);
        console.error("Error submitting form:", error);
        setLoading(false);
      });
  };
  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <div className="mb-6 mt-4">
        <h2 className="text-center font-bold text-lg mb-11">Add</h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {/* Package Name */}
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter the category" }]}
          >
            <Input className="py-2" type="price" placeholder="Enter Category" />
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea
              className="py-2"
              type="price"
              placeholder="Enter Category"
            />
          </Form.Item>
          <Form.Item label="Photos">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              multiple={true}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </Form.Item>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 w-full border text-black rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 w-full bg-black text-white rounded-md"
            >
              {loading ? <Spin size="small" /> : "Add"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
