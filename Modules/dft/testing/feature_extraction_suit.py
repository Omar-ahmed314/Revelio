import unittest
import sys
sys.path.insert(0, '../')
from Feature_Extraction import *


# testing line interpolation method
class TestLineInterpolation(unittest.TestCase):

    def setUp(self):
        self.feature_ext = Feature_Extraction()
    
    def test_return_fixed_size(self):
        new_line = np.arange(127)
        inter_line = self.feature_ext.line_interpolate(new_line)
        print(len(inter_line))
        self.assertEqual(300, len(inter_line))

    def test_return_correct_values(self):
        new_line = [1, 2]
        inter_line = self.feature_ext.line_interpolate(new_line, 3)
        self.assertTupleEqual(tuple([1, 1.5, 2]), tuple(inter_line))
    

if __name__ == '__main__':
    unittest.main()