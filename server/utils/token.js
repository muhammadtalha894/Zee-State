export const tokenResponse = async (user, res) => {
  const token = await user.tokenGenerate(user._id);

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  const { password: password, ...rest } = user._doc;

  res
    .status(200)
    .cookie('access_token', token, options)
    .json({ success: true, rest });
};
